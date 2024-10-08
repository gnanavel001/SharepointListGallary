import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IDlaccrodianProps {
  Title: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  listId: string;
  listAccordianColumns: any;
  columnsToShow1: any;
  columnsToShow2: any;
  columnsToShow3: any;
}
