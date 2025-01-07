import GroupForm from "./GroupForm";

export default function CreateGroup() {
    const group = {
        location: '',
        name: '',
        about: '',
        type: '',
        privateGroup: '',
        image: ''
    }

    return (<GroupForm group={group} formType="Create Group" />)
}
