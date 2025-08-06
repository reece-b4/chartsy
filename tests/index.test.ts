/// <reference types="vitest" />
import { render, screen, waitFor } from "@testing-library/vue";
import '@testing-library/jest-dom';
import App from "../src/App.vue";
import { vi } from "vitest";

// Mock Device plugin
vi.mock("@capacitor/device", () => ({
  Device: {
    getInfo: vi.fn(() =>
      Promise.resolve({
        platform: "mac", // You can change this to 'ios' or 'android' to test different UI branches
      } as any),
    ),
  },
}));

// Mock getAllTasks API call
vi.mock("../api", async () => {
  return {
    getAllTasks: () =>
      Promise.resolve([
        {
          id: 1,
          title: "Mock Task",
          description: "Mock Description",
          status: "complete",
        },
      ]),
    postTask: () => Promise.resolve(),
  };
});

describe("App.vue", () => {
  it("renders platform-specific UI and tasks", async () => {
    render(App);
  });

  it("renders buttons", async () => {
    render(App);

    await waitFor(async () => {
      const button = await screen.findByRole("button", {
        name: /write tasks? to file/i,
      });
      expect(button).toBeInTheDocument();
    });

    expect(screen.getByText("post dummy task")).not.toBeNull();
  });
});
