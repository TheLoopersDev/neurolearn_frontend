// src/app/(auth)/dashboard/setting/_components/EditInformationForm.tsx
import React from 'react';
import FormField from './FormField';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
// <<-- THAY ĐỔI 2: IMPORT TYPE TỪ FILE CHA -->>
import { ProfileFormData } from './ProfileEditorForm';

interface EditInformationFormProps {
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

const EditInformationForm: React.FC<EditInformationFormProps> = ({ register, errors }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800">Edit Information</h2>
      <div className="mt-6 space-y-5">
        <FormField
          label="Name"
          id="name"
          type="text"
          placeholder="Your full name"
          {...register('name')}
          error={errors.name?.message}
        />
        <FormField
          label="Age"
          id="age"
          type="number"
          placeholder="Your Age"
          {...register('age')}
          error={errors.age?.message}
        />
      </div>
    </section>
  );
};

export default EditInformationForm;
