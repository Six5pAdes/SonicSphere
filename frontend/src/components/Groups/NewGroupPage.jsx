import GroupForm from "./GroupForm";

export default function NewGroupPage() {
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
