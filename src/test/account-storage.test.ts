import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setAccountScope } from "@/game/account-storage";
import { emptyProgress, loadProgress, saveProgress } from "@/game/progress";
import { loadDriveBest, saveDriveBest } from "@/game/drive-engine";
beforeEach(() => { localStorage.clear(); setAccountScope(null); });
afterEach(() => setAccountScope(null));
describe("separação entre contas e visitante", () => {
  it("não mistura as pontuações de duas pessoas no mesmo navegador", () => {
    saveProgress({ ...emptyProgress(), stars: { gatinho: 3 } }); saveDriveBest(7);
    setAccountScope("ana"); expect(loadProgress().stars).toEqual({}); expect(loadDriveBest()).toBe(0);
    saveProgress({ ...emptyProgress(), stars: { fogo: 2 } }); saveDriveBest(4);
    setAccountScope("bia"); expect(loadProgress().stars).toEqual({}); expect(loadDriveBest()).toBe(0);
    saveProgress({ ...emptyProgress(), stars: { memoria: 3 } });
    setAccountScope("ana"); expect(loadProgress().stars).toEqual({ fogo: 2 }); expect(loadDriveBest()).toBe(4);
    setAccountScope(null); expect(loadProgress().stars).toEqual({ gatinho: 3 }); expect(loadDriveBest()).toBe(7);
  });
});
