// src/app/(auth)/dashboard/setting/_components/EditInformationForm.tsx
import React from 'react';
import FormField from './FormField';

// Định nghĩa props trực tiếp, không cần import type riêng cho form
interface EditInformationFormProps {
  nameValue: string;
  ageValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditInformationForm: React.FC<EditInformationFormProps> = ({
  nameValue,
  ageValue,
  onChange,
}) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800">Edit Information</h2>
      <div className="mt-6 space-y-5">
        <FormField
          label="Name"
          id="name"
          name="name"
          type="text"
          value={nameValue}
          onChange={onChange}
          placeholder="Your full name"
        />
        <FormField
          label="Age"
          id="age"
          name="age"
          type="number"
          value={ageValue}
          onChange={onChange}
          placeholder="Your Age"
        />
      </div>
    </section>
  );
};

export default EditInformationForm;
