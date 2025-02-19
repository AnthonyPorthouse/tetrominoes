import { beforeEach, describe, expect, test } from "vitest";
import { Point } from "../utils";
import { State } from "./state";

describe(State, async () => {
  let state: State;

  beforeEach(() => {
    state = new State(3, 5);
  });

  describe("board state", async () => {
    test("it returns an empty board by default", async () => {
      expect(state.toString()).toBe(
        "...\n" + "...\n" + "...\n" + "...\n" + "...\n",
      );
    });

    test("it displays set blocks", async () => {
      for (let i = 0; i < state.height; i++) {
        state.setBlock(new Point(1, i));
      }

      expect(state.toString()).toBe(
        ".#.\n" + ".#.\n" + ".#.\n" + ".#.\n" + ".#.\n",
      );
    });
  });

  describe("row clears", async () => {
    test("it clears no rows if nothing is set", async () => {
      expect(state.clearRows()).toBe(0);
    });

    describe("with a set row", async () => {
      beforeEach(() => {
        state = new State(3, 5);
        for (let i = 0; i < state.width; i++) {
          state.setBlock(new Point(i, state.height - 1));
        }
      });

      test("it starts with a row", async () => {
        expect(state.toString()).toBe(
          "...\n" + "...\n" + "...\n" + "...\n" + "###\n",
        );
      });

      test("it clears a row", async () => {
        expect(state.clearRows()).toBe(1);
      });

      test("it has no rows", async () => {
        state.clearRows();

        expect(state.toString()).toBe(
          "...\n" + "...\n" + "...\n" + "...\n" + "...\n",
        );
      });
    });

    describe("it moves blocks down when it clears a row", async () => {
      beforeEach(() => {
        state = new State(3, 5);
        for (let i = 0; i < state.width; i++) {
          state.setBlock(new Point(i, state.height - 1));
        }

        state.setBlock(new Point(0, 1));
        state.setBlock(new Point(1, 2));
        state.setBlock(new Point(1, 3));
      });

      test("it moves blocks down when it clears a row", async () => {
        expect(state.toString()).toBe(
          "...\n" + "#..\n" + ".#.\n" + ".#.\n" + "###\n",
        );
      });

      test("it clears a row", async () => {
        expect(state.clearRows()).toBe(1);
      });

      test("it has no rows", async () => {
        state.clearRows();

        expect(state.toString()).toBe(
          "...\n" + "...\n" + "#..\n" + ".#.\n" + ".#.\n",
        );
      });
    });
  });
});
