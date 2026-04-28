import {
    type JSX,
    type ReactNode,
    type Ref,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

interface DropdownMenuProps {
    children: ReactNode;
    closeOnEscape?: boolean;
    triggerElement: (props: {
        onClick: () => void;
        ref: Ref<HTMLElement>;
    }) => ReactNode;
}

function DropdownMenu({
    children,
    closeOnEscape = true,
    triggerElement,
}: DropdownMenuProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent): void => {
            if (closeOnEscape && event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };
        const handleMouseDown = (event: MouseEvent): void => {
            const target = event.target as Node;
            if (
                menuRef.current &&
                !menuRef.current.contains(target) &&
                triggerRef.current &&
                !triggerRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleMouseDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [closeOnEscape, isOpen]);

    return (
        <>
            {triggerElement({
                onClick: () => setIsOpen((prev) => !prev),
                ref: triggerRef,
            })}
            {isOpen &&
                createPortal(
                    <div
                        className="fixed top-23 right-4 z-10 flex w-3xs flex-col rounded-md border-2 border-slate-300 bg-slate-100 py-2 shadow-md *:flex *:flex-row *:items-center *:gap-x-4 *:py-3 *:pl-4 sm:top-16 [&_a:hover]:bg-slate-200"
                        onClick={() => setIsOpen(false)}
                        ref={menuRef}
                    >
                        {children}
                    </div>,
                    document.body,
                )}
        </>
    );
}

export { DropdownMenu };
