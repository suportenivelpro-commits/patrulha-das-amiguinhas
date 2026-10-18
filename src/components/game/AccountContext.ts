import { createContext, useContext } from "react";
import type { AccountController } from "@/game/account-controller";
export const AccountContext = createContext<AccountController | null>(null);
export const useAccount = () => useContext(AccountContext);
