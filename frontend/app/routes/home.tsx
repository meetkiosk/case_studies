import KioskLogo from "../assets/kiosk-logo.svg";

export async function loader() {
  return {};
}

export async function action() {
  return {};
}

export default function CSRDFormPage() {
  return (
    <div>
      <img src={KioskLogo} alt="Kiosk Logo" width="200" />
      <h1>CSRD Disclosure Requirement Form</h1>
      <p>
        Welcome to the CSRD technical test. Please implement the form to display
        and save answers to the disclosure requirement questions.
      </p>
    </div>
  );
}
