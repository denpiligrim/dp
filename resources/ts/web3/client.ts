import { createThirdwebClient } from "thirdweb";
 
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_PUBLIC_THIRDWEB_CLIENT_ID,
});