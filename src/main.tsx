import { createRoot } from "react-dom/client";
import { Game } from "./components/game/Game";
import "./styles.css";

createRoot(document.getElementById("root")!).render(<Game />);
