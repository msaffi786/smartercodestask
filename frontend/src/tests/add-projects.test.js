import React from "react";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import AddProject from "../components/add-project.component";
axios.defaults.adapter = require("axios/lib/adapters/http");
afterEach(cleanup);
// axios.defaults.adapter = require('axios/lib/adapters/http');
test("renders Welcome", () => {
  const { asFragment } = render(
    <BrowserRouter>
      <AddProject />
    </BrowserRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});


test("add new project", async () => {
  const { getByText, getByLabelText, rerender, getByRole } = render(
    <BrowserRouter>
      <AddProject />
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
