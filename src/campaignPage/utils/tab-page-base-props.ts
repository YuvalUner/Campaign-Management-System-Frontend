/**
 * An interface used to define the base props that each tab needs.
 * Each tab should extend this interface if needed.
 */
interface TabPageBaseProps {
    name: string;
    closeFunction: (name: string) => void;
}

export default TabPageBaseProps;
