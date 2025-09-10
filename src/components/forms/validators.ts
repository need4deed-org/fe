import { apiPathAuthEmailDomain } from "../../config/constants";

export async function validateRACEmail(email: string, errorMsg = "Bad email.") {
  const [, domain] = email.split("@");
  const url = `${apiPathAuthEmailDomain}?domain=${domain}`;

  const isAuth = await fetch(url).then((response) => response.json());

  return isAuth ? undefined : errorMsg;
}

export default {};
