import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/i18n";
import { ProfileProvider, useProfile } from "@/lib/profile";
import { readProfile, PROFILE_KEY } from "@/lib/playground";

function ProfileProbe() {
  const { name, editName } = useProfile();
  return <><output data-testid="name">{name}</output><button onClick={editName}>Edit</button></>;
}
function mount() { return render(<LanguageProvider><ProfileProvider><ProfileProbe /></ProfileProvider></LanguageProvider>); }
beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("Playground name", () => {
  it("asks first-time visitors and remembers their entered name", () => {
    mount();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "  Rafay  " } });
    fireEvent.submit(screen.getByRole("textbox").closest("form") as HTMLFormElement);
    expect(screen.getByTestId("name")).toHaveTextContent("Rafay");
    expect(readProfile(localStorage)?.name).toBe("Rafay");
  });
  it("allows a returning visitor to change the saved name", () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: "Rafay" }));
    mount();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Abdul" } });
    fireEvent.submit(screen.getByRole("textbox").closest("form") as HTMLFormElement);
    expect(readProfile(localStorage)?.name).toBe("Abdul");
    expect(screen.getByTestId("name")).toHaveTextContent("Abdul");
  });
});