import type { Meta, Story } from "@storybook/react";
import React from "react";
import { LineChartWrapper } from "../../index";
import { ILineChart } from "../utils/chartInterfaces";

export default {
  title: "Example/Chart/LineChartWrapper",
  component: LineChartWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LineChartWrapper>;

const Template: Story<ILineChart> = (args: ILineChart) => (
  <LineChartWrapper {...args} />
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
  options: {
    showLegend: true,
    showGridX: true,
    showGridY: true,
    xAxisTitle: "Category",
    yAxisTitle: "Value",
  },
  yFormat: "number",
  keys: ["value"],
};

export const Loading = Template.bind({});
Loading.args = {
  title: "Sales Distribution",
  description: "A visual representation of sales distribution by category.",
  dataset: null,
  options: {
    showLegend: true,
    showGridX: true,
    showGridY: true,
    xAxisTitle: "Category",
    yAxisTitle: "Value",
  },
  yFormat: "number",
  keys: ["value"],
};

export const Empty = Template.bind({});
Empty.args = {
  title: "Sales Distribution",
  description: "A visual representation of sales distribution by category.",
  dataset: [],
  options: {
    showLegend: true,
    showGridX: true,
    showGridY: true,
    xAxisTitle: "Category",
    yAxisTitle: "Value",
  },
  yFormat: "number",
  keys: ["value"],
};
