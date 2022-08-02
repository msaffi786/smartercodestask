import React from "react";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import AddSkill from "../components/add-skill.component";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
axios.defaults.adapter = require("axios/lib/adapters/http");
afterEach(cleanup);
test("renders Welcome", () => {
  const { asFragment } = render(
    <BrowserRouter>
      <AddSkill />
    </BrowserRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});


test("add new skill", async () => {
  const { getByText, getByLabelText, rerender, getByRole } = render(
    <BrowserRouter>
      <AddSkill />
    </BrowserRouter>
  );

  getByLabelText("Title");
  getByLabelText("Description");
  const inputName = getByLabelText("Title");
  fireEvent.change(inputName, { target: { value: "new jest title" } });
  const inputAge = getByLabelText("Description");
  fireEvent.change(inputAge, { target: { value: "new jest description" } });
  const button = screen.getByText("Submit");
  fireEvent.click(button);
  //   await waitFor(() => fireEvent.click(button)
  expect(inputName.innerText).toBe(undefined);
});
