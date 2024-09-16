import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { PropertyFieldTermPicker } from "@pnp/spfx-property-controls/lib/PropertyFieldTermPicker";
import { IPickerTerms } from "@pnp/spfx-property-controls/lib/PropertyFieldTermPicker";

import * as strings from "DlaccrodianWebPartStrings";
import Dlaccrodian from "./components/Dlaccrodian";
import { IDlaccrodianProps } from "./components/IDlaccrodianProps";

import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";
import {
  IColumnReturnProperty,
  PropertyFieldColumnPicker,
  PropertyFieldColumnPickerOrderBy,
} from "@pnp/spfx-property-controls/lib/PropertyFieldColumnPicker";

export interface IDlaccrodianWebPartProps {
  Title: string;
  listId: string;
  listAccordianColumns: any;
  columnsToShow: string;
  terms: IPickerTerms;
}
export interface IPropertyControlsTestWebPartProps {
  lists: string; // Stores the list ID(s)
}
export interface IPropertyControlsTestWebPartProps {
  list: string; // Stores the list ID
  column: string; // Stores the single column property (property can be configured)
  multiColumn: string; // Stores the multi column property (property can be configured)
}

export default class DlaccrodianWebPart extends BaseClientSideWebPart<IDlaccrodianWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IDlaccrodianProps> = React.createElement(
      Dlaccrodian,
      {
        Title: this.properties.Title,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        listId: this.properties.listId,
        listAccordianColumns: this.properties.listAccordianColumns,
        columnsToShow: this.properties.columnsToShow,
        terms: this.properties.terms,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
            case "TeamsModern":
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }
  // for return a apply button
  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
  //for apply button end
  protected onAfterPropertyPaneChangesApplied(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    console.log(this.properties.listAccordianColumns);
    this.render();
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("Title", {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyFieldListPicker("listId", {
                  label: "Select a list",
                  selectedList: this.properties.listId,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context as any,
                  deferredValidationTime: 0,
                  key: "listId",
                }),
                PropertyFieldColumnPicker("listAccordianColumns", {
                  label: "Select columns for grouping",
                  context: this.context as any,
                  selectedColumn: this.properties.listAccordianColumns,
                  listId: this.properties.listId,
                  disabled: false,
                  orderBy: PropertyFieldColumnPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  deferredValidationTime: 0,
                  key: "listAccordianColumns",
                  displayHiddenColumns: false,
                  columnReturnProperty: IColumnReturnProperty.Title,
                  multiSelect: true,
                }),
                PropertyFieldColumnPicker("columnsToShow", {
                  label: "Select columns",
                  context: this.context as any,
                  selectedColumn: this.properties.columnsToShow,
                  listId: this.properties.listId,
                  disabled: false,
                  orderBy: PropertyFieldColumnPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  deferredValidationTime: 0,
                  key: "columnsToShow",
                  displayHiddenColumns: false,
                  columnReturnProperty: IColumnReturnProperty.Title,
                  multiSelect: true,
                }),
                PropertyFieldTermPicker("terms", {
                  label: "Select terms",
                  panelTitle: "Select terms",
                  initialValues: this.properties.terms,
                  allowMultipleSelections: false,
                  isTermSetSelectable: true,
                  excludeSystemGroup: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  context: this.context as any,
                  deferredValidationTime: 0,
                  key: "termSetsPickerFieldId",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
