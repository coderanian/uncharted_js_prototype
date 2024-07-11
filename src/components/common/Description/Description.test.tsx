import React from "react";
import {Description} from "../index";
import '@testing-library/jest-dom/extend-expect';
import {render, screen} from "@testing-library/react";

describe('<Description />', () => {
    it('renders h5 and p element with title when title and description are provided', () => {
        const title = 'Test chart';
        const description = 'Chart test.';
        render(<Description title={title} description={description} />);
        const titleElement = screen.getByRole('heading', { level: 5 });
        const descriptionElement = screen.getByText(description);
        expect(descriptionElement).toBeInTheDocument();
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.textContent).toBe(title);
    });

    it('renders nothing when title and description are not provided', () => {
        render(<Description title={undefined} description={undefined} />);
        const titleElement = screen.queryByRole('heading', { level: 5 });
        const descriptionElement = screen.queryByText('Chart test.');
        expect(titleElement).not.toBeInTheDocument();
        expect(descriptionElement).not.toBeInTheDocument();
    });
});