import * as React from 'react';
import JsonEditorWrapper from '../../components/json-editor-wrapper';
import './editor.css';
import {SiteHierarchy} from '../../components/site-hierarchy';
import {IMessage, ISiteScriptContainer, ISiteScript, INodeTypeProps, IDictionary} from '../../types';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import {convertJsonToSiteHierarchy, convertSiteHierarchyToJson} from '../../converters';
import {TreeItem} from 'react-sortable-tree';
import { autobind } from '@uifabric/utilities';


export interface IDispatchProps {
    removemessage : (id : string) => void;
    addmessage : (message : IMessage) => void;
    setSiteScriptContainer : (siteScriptContainer : ISiteScriptContainer) => void;
    setTreeData : (treeData : TreeItem[]) => void;
    setNodeTypeProps : (nodeType:string, nodeTypeProps:INodeTypeProps)=>void;
    setAllNodeTypeProps: (propsAll:IDictionary<INodeTypeProps>)=>void;
}

export interface IStateProps {
    messageList : IMessage[];
    currentSiteScriptContainer : ISiteScriptContainer;
    treeData : TreeItem[];
    nodeTypesProps: IDictionary<INodeTypeProps>;
}
export interface IEditorState {
    siteHierarchyKey:string;
}
export function mapStateToProps({messageList, currentSiteScriptContainer, treeData,nodeTypesProps} : IStateProps) {
    return {messageList, currentSiteScriptContainer, treeData,nodeTypesProps};
}
export function mapDispatchToProps(dispatch : any) : IDispatchProps {
    return {
        removemessage: (id : string) => {
            dispatch(actions.removemessage(id));
        },
        addmessage: (message : IMessage) => {
            dispatch(actions.addmessage(message));
        },
        setSiteScriptContainer: (siteScriptContainer : ISiteScriptContainer) => {
            dispatch(actions.setSiteScript(siteScriptContainer));
        },
        setTreeData: (treeData : TreeItem[]) => {
            dispatch(actions.setTreeData(treeData));
        },
        setNodeTypeProps: (nodeType:string, nodeTypeProps:INodeTypeProps)=>{
            dispatch(actions.setNodeTypeProps(nodeType, nodeTypeProps));
        },
        setAllNodeTypeProps: (propsAll:IDictionary<INodeTypeProps>)=>{
            dispatch(actions.setAllNodeTypeProps(propsAll));
        }

    };
}

class Editor extends React.Component < IStateProps & IDispatchProps,
IEditorState > {
    constructor(props : IStateProps & IDispatchProps) {
        super(props);
        this.state = {siteHierarchyKey:"1000"};
  if(this.isIE()) {
      alert("Unfortunately IE is not supported. Please use a modern browser instead")
  }
    }
    private setSiteScript(siteScript : ISiteScript) {
        var currentContainer = this.props.currentSiteScriptContainer;
        currentContainer.siteScript = siteScript;
        var newTreeData = convertJsonToSiteHierarchy(currentContainer);
        newTreeData = [this.setupExpansion(this.props.treeData[0], newTreeData[0])]
        this
            .props
            .setSiteScriptContainer(currentContainer);

            this
            .props
            .setTreeData(newTreeData);
    }
    private isIE() {
        const match = navigator.userAgent.search(/(?:MSIE|Trident\/.*; rv:)/);
        let isIE = false;
    
        if (match !== -1) {
            isIE = true;
        }
    
        return isIE;
    }
    private setupExpansion(oldRoot:TreeItem, newRoot:TreeItem):TreeItem {
        if(oldRoot.children) {
            oldRoot.children!.forEach(oldChild=>{
                const newElemFound = newRoot.children!.find(newChild=>newChild.type===oldChild.type);
                if(newElemFound) {
                    newElemFound.expanded=oldChild.expanded
                }
            })
        }
        return newRoot
    }
 
    @autobind
    private setTreeAndScriptData(treeData:TreeItem[]) {
        this.props.setTreeData(treeData);
        this.props.setSiteScriptContainer(convertSiteHierarchyToJson(treeData));
          }
    @autobind
    private reloadTree() {
        //THIS IS NOT IN USE. 2018.10.12 Things seem to refresh ok without this. It was causing reload of the tree and scrolling to the top
        this.setState({siteHierarchyKey:Math.floor((Math.random() * 1000000) + 1).toString()}) //This will refresh the site hierarchy by renewing the key. Otherwise some props are not recalculated
    }
    render() {
        return <div className="sd_editor">

                <div id="sd_hierarchy" key={this.state.siteHierarchyKey}><SiteHierarchy
                    setSiteScriptContainer={this.props.setSiteScriptContainer}
                    setTreeAndScriptData={this.setTreeAndScriptData}
                    treeData={this.props.treeData}
                    setNodeTypeProps={this.props.setNodeTypeProps}
                    nodeTypesProps={this.props.nodeTypesProps}
                    setAllNodeTypeProps={this.props.setAllNodeTypeProps}
                    reloadTree={this.reloadTree}
                    />
                </div>
                <div id="sd_json_editor"><JsonEditorWrapper
                    currentSiteScript={this.props.currentSiteScriptContainer
            ? this.props.currentSiteScriptContainer.siteScript
            : null}
                    setSiteScript={this
            .setSiteScript
            .bind(this)}/>
                </div>

        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);