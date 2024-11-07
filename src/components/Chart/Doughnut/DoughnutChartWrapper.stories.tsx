import type { Meta, Story } from "@storybook/react";
import React from "react";
import { DoughnutChartWrapper } from "../../index";
import { IPieChart } from "../utils/chartInterfaces";

export default {
  title: "Example/Chart/DoughnutChartWrapper",
  component: DoughnutChartWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DoughnutChartWrapper>;

const Template: Story<IPieChart> = (args: IPieChart) => (
  <DoughnutChartWrapper {...args} />
);

export const Loaded = Template.bind({});
Loaded.args = {
  title: "Sales Distribution",
  description: "A visual representation of sales distribution by category.",
  dataset: [
    { category: "Electronics", value: 2500 },
    { category: "Clothing", value: 1800 },
    { category: "Home Decor", value: 1200 },
  ],
  options: { halfPieChart: true },
  valueFormat: "number",
  keys: ["value"],
};

export const Loading = Template.bind({});
Loading.args = {
  title: "Sales Distribution",
  description: "A visual representation of sales distribution by category.",
  dataset: null,
  options: { halfPieChart: true },
  valueFormat: "number",
  keys: ["value"],
};

export const Empty = Template.bind({});
Empty.args = {
  title: "Sales Distribution",
  description: "A visual representation of sales distribution by category.",
  dataset: [],
  options: { halfPieChart: true },
  valueFormat: "number",
  keys: ["value"],
};

export const Error = Template.bind({});
Error.args = {
  title: "Sales Distribution",
  description: "A visual representation of sales distribution by category.",
  dataset: [
    {
      error: {
        code: 500,
        name: "requestTimeout",
        message: "Server unavailable, please retry at a later time.",
        header: "Request timeout",
      },
    },
  ],
  options: { showLegend: true, halfPieChart: true },
  valueFormat: "number",
  keys: ["value"],
};
