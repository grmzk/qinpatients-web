import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { TableContent } from "../types/TableContent";

import Table from "./Table";

afterEach(cleanup);

describe("Table", () => {
  it("allows nested data without allowing it as a table column", () => {
    type Data = { name: string; age: number; details: { text: string }[]; trauma: string | null };
    expectTypeOf<TableContent<Data>["head"][string]>().toEqualTypeOf<"name" | "age">();
  });

  it("keeps the clicked cell mounted and handles double-clicks", () => {
    const onDoubleClick = vi.fn();
    render(
      <Table
        title="Table"
        helpMessage=""
        noDataMessage="No data"
        isLoading={false}
        tableContent={{
          head: { Name: "name" },
          content: [{ data: { name: "Patient" }, action: onDoubleClick, extraInfoCol1: "Details" }],
        }}
      />
    );

    const cell = screen.getByText("Patient");
    fireEvent.click(cell);
    expect(screen.getByText("Patient")).toBe(cell);
    expect(screen.getByText("Details")).toBeTruthy();

    userEvent.dblClick(cell);
    expect(onDoubleClick).toHaveBeenCalledTimes(1);
  });
});
