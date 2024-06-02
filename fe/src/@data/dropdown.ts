export interface Dropdown {
  label: string;
  disabled?: false;
  action?: () => void;
  hasDeleteItem?: boolean;
  itemHasMarginBottom?: string;
  tooltipTextKey?: string;
  showToolTip?: boolean;
  showDotsBtn?: boolean;
}
