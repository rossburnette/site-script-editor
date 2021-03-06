import * as React from 'react';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {TreeItem, changeNodeAtPath} from 'react-sortable-tree';
import './sd-caml-field.css';

interface ISDCodeFieldProps {
    node : TreeItem;
    path : string[] | number[];
    setTreeAndScriptData : (treeData : TreeItem[]) => void;
    treeData : TreeItem[];
    label : string;
    fieldName : string;
}

export default class SDCamlField extends React.Component < ISDCodeFieldProps> {
    constructor(props : ISDCodeFieldProps) {
        super(props);
        this.state = {isValid:true,fieldValue:""}
    }
    render() {
        var getNodeKey = ({treeIndex} : any) => treeIndex;
        var {node, path, setTreeAndScriptData, treeData, label} = this.props;

        return <TextField
        onChanged={fieldValue => {
            var newNode = {...node};
            newNode.data[this.props.fieldName] = fieldValue;
            setTreeAndScriptData(changeNodeAtPath({
                treeData,
                path,
                getNodeKey,
                newNode
            }));
        }}
            borderless
            value={this.props.node.data[this.props.fieldName]}
            className={'sd_site_hierarchy_field sd_site_hierarchy_caml_field'}
            label={label}
            multiline
            rows={4}/>
    }

}