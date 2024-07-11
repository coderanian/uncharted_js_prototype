import type {Meta, Story, StoryObj} from '@storybook/react';
import React from 'react';
import {BubbleChartWrapper} from "../../index";
import {IBubbleChart} from "../utils/chartInterfaces";

export default {
    title: 'Example/Chart/BubbleChartWrapper',
    component: BubbleChartWrapper,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BubbleChartWrapper>;

const Template: Story<IBubbleChart> = (args: IBubbleChart) => <BubbleChartWrapper {...args} />;

export const Loaded = Template.bind({});
Loaded.args = {
    title: 'Sales Distribution',
    description: 'A visual representation of sales distribution by category.',
    dataset: [
        {
            "carrier": "Speedy Gonzales",
            "carrier_type": "Mapped",
            "shipment_count": 1000,
            "average_transit_time": 3,
            "total_cargo_weight_kg": 5000,
            "on_time_delivery_percent": 97,
            "tracking_rate_percent": 100,
            "cargo_intact_percent": 46,
            "order_acceptance_percent": 65,
            "average_costs_per_km_eur": 580,
            "average_costs_per_tonnage_km_eur": 0.85,
            "total_costs_eur": 9515,
            "freight_costs_eur": 3818.02,
            "average_freight_costs_eur": 1000,
            "diesel_costs_eur": 0,
            "other_costs_eur": 149.80
        },
        {
            "carrier": "Snails Express",
            "carrier_type": "Mapped",
            "shipment_count": 500,
            "average_transit_time": 1,
            "total_cargo_weight_kg": 500,
            "on_time_delivery_percent": 77,
            "tracking_rate_percent": 20,
            "cargo_intact_percent": 46,
            "order_acceptance_percent": 65,
            "average_costs_per_km_eur": 58,
            "average_costs_per_tonnage_km_eur": 0.25,
            "total_costs_eur": 6615,
            "freight_costs_eur": 3000,
            "average_freight_costs_eur": 250,
            "diesel_costs_eur": 0,
            "other_costs_eur": 0
        }
    ],
    options: {
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Category",
        yAxisTitle: "Value"
    },
    xFormat: 'number',
    yFormat: 'percent',
    rFormat: 'percent',
    keys: ['on_time_delivery_percent', 'tracking_rate_percent', 'shipment_count' ],
};

export const Loading = Template.bind({});
Loading.args = {
    title: 'Sales Distribution',
    description: 'A visual representation of sales distribution by category.',
    dataset: null,
    options: {
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Category",
        yAxisTitle: "Value"
    },
    xFormat: 'number',
    yFormat: 'percent',
    rFormat: 'percent',
    keys: ['on_time_delivery_percent', 'tracking_rate_percent', 'shipment_count' ],
};

export const Empty = Template.bind({});
Empty.args = {
    title: 'Sales Distribution',
    description: 'A visual representation of sales distribution by category.',
    dataset: [],
    options: {
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Category",
        yAxisTitle: "Value"
    },
    xFormat: 'number',
    yFormat: 'percent',
    rFormat: 'percent',
    keys: ['on_time_delivery_percent', 'tracking_rate_percent', 'shipment_count' ],
};

export const Error = Template.bind({});
Error.args = {
    title: 'Sales Distribution',
    description: 'A visual representation of sales distribution by category.',
    dataset: [{
        error: {
            code: 500 ,
            name: 'requestTimeout',
            message: 'Server unavailable, please retry at a later time.' ,
            header: 'Request timeout',
        }
    }],
    options: {
        showLegend: true,
        showGridX: true,
        showGridY: true,
        xAxisTitle: "Category",
        yAxisTitle: "Value"
    },
    xFormat: 'number',
    yFormat: 'percent',
    rFormat: 'percent',
    keys: ['on_time_delivery_percent', 'tracking_rate_percent', 'shipment_count' ],
};