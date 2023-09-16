import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigate,
  useSubmit
} from 'react-router-dom';
import { getContacts, createContact } from '../contacts';
import { useEffect } from 'react';
import './index.css';


// create and export a loader function
// loader functions allows components to read
// data when the route is matched with an eleent
// the loader is refactored to access the request
// which is GET by default and a new URL is formed
// from the data provided to it which allows us to search
// for list of contacts with key words or letters
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return { contacts, q };
}

/*
  create action functions which allows us to specify
  how the url segment mutates the data passed to it.
  This data can be accessed using the formData during
  the POST method or the URLSearchParam during the GET
  method.
*/

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

// root component
export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigate = useNavigate();
  const submit = useSubmit();
  const searching = navigate.location &&
      new URLSearchParams(navigate.location.search).has('q');


  // useEffect to change the list of contacts when the use clicks the
  // back button
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={
                searching ? 'loading' : ''
              }
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => {
                return (
                  <li key={contact.id}>
                    <NavLink
                      to={`contacts/${contact.id}`}
                      className={({ isActive, isPending }) => 
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )} {" "}
                      {contact.favorite && <span>★</span>}
                    </NavLink>
                  </li>
                )
              })
              }
            </ul>
          ) : (
            <p>
              <i>No Contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={
          navigate.state === "loading" ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  )
}