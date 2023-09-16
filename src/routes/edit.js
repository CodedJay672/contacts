import { Form, useLoaderData, redirect } from "react-router-dom";
import { updateContact } from "../contacts";
import { useNavigate } from "react-router-dom";

// create an action that will update the names
// and other details of the contact we wish to
// edit. This form will post to the action and
// we will access the data via the formData API

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`)
}

// Edit contact component
export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <input
          placeholder="first"
          aria-label="first name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="last"
          aria-label="last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          placeholder="@jack"
          type="text"
          name="twitter"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => {
          navigate(-1);
        }}>Cancel</button>
      </p>
    </Form>
  );
}