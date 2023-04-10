export interface TabHeader {
    text: string;
}

export interface TabPage {
    header: TabHeader;
    /**
     * Due to the way Syncfusion tabs work, we need a function that returns a JSX.Element instead of just a JSX.Element.
     * Using a JSX.Element directly will cause a compilation error.
     */
    component: () => JSX.Element;
}
