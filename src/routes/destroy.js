import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";


// create the action for when the user clicks the
// delete button from the contact UI

export async function action({ params }) {
  await deleteContact(params.contactId);
  return redirect("/");
}