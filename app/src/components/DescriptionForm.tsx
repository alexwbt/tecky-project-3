import React from "react";


interface IDescriptionFormProps {

}

interface IDescriptionFormStates {
    title: string;
    description: string;
    publish: boolean;
}

export default class DescriptionForm extends React.Component<IDescriptionFormProps, IDescriptionFormStates> {

    constructor(props: IDescriptionFormProps) {
        super(props);
        this.state = {
            title: "",
            description: "",
            publish: false
        };
    }

    inputChange(field: "title" | "description", event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        this.setState({ ...this.state, [field]: event.target.value });
    }

    checkBoxChange(field: "publish", event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ ...this.state, [field]: event.target.checked });
    }

    render() {
        return <form className="p-2">
            <label htmlFor="titleInput" className="input-group-prepend">
                <span className="">Title:</span>
            </label>
            <input
                id="titleInput"
                className="form-control"
                name="title"
                placeholder="Title"
                value={this.state.title}
                onChange={this.inputChange.bind(this, "title")}
                required />
            <label htmlFor="descriptionInput" className="input-group-prepend mt-1">
                <span className="">Description:</span>
            </label>
            <textarea
                id="descriptionInput"
                rows={5}
                className="form-control"
                placeholder="Description"
                value={this.state.description}
                onChange={this.inputChange.bind(this, "description")}
                required />
            {/* <label htmlFor="publishInput" className="input-group-prepend mt-1">
                <span className="">Publish:</span>
            </label>
            <input
                type="checkbox"
                id="publishInput"
                className="d-inline"
                placeholder="publish"
                checked={this.state.publish}
                onChange={this.checkBoxChange.bind(this, "publish")}
                required /> */}
            <input type="submit" className="btn btn-info py-1 mt-3" value="Save" />
        </form>
    }

}
