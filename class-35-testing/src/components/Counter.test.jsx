import { render, screen, fireEvent } from "@testing-library/react";
import Counter from './Counter';

describe("Basic Counter Test Cases", () => {
    test("initial state check", () => {
        // render the component in isolation
        render(<Counter />);

        // Selection
        const countText = screen.getByText("Count is 0");
        const plusText = screen.getByText("+");
        const minusText = screen.getByText("-");

        // Verification
        expect(countText).toBeInTheDocument();
        expect(plusText).toBeInTheDocument();
        expect(minusText).toBeInTheDocument();
    });

    test("inc by 1", () => {
        render(<Counter />);
        const plusText = screen.getByText("+");
        fireEvent.click(plusText);

        const isOnePresent = screen.getByText("Count is 1");
        expect(isOnePresent).toBeInTheDocument()
    });

    test("dec by 1", () => {
        render(<Counter />);
        const minusText = screen.getByText("-");
        fireEvent.click(minusText);

        const isMinusOnePresent = screen.getByText("Count is -1");
        expect(isMinusOnePresent).toBeInTheDocument()
    });
});