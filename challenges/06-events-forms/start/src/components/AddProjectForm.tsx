// TODO: Implement the AddProjectForm component.
//
// This component renders a form with four controlled inputs:
//   - name        (text input, required, min 3 chars)
//   - description (textarea, required)
//   - status      (select: active | completed | archived, default "active")
//   - dueDate     (date input, optional)
//
// Props:
//   onAddProject: (data: ProjectFormData) => void
//   onCancel: () => void
//
// Steps:
// 1. Import ProjectFormData and FormErrors from '../types'
// 2. Declare form state as a single object with useState<ProjectFormData>
// 3. Declare errors state with useState<FormErrors>({})
// 4. Write a handleSubmit function that:
//      a. Calls e.preventDefault()
//      b. Validates name (non-empty and >= 3 chars) and description (non-empty)
//      c. If invalid: setErrors(newErrors) and return
//      d. If valid: call onAddProject(formData), reset form state, reset errors
// 5. Wire each input's value and onChange
//    - Use React.ChangeEvent<HTMLInputElement> for text/date inputs
//    - Use React.ChangeEvent<HTMLTextAreaElement> for the textarea
//    - Use React.ChangeEvent<HTMLSelectElement> for the select
// 6. Render inline error messages below invalid fields
// 7. Add a Cancel button with type="button" that calls onCancel

export function AddProjectForm() {
  // TODO: implement
  return (
    <div>
      <p>TODO: implement form</p>
    </div>
  )
}

export default AddProjectForm
