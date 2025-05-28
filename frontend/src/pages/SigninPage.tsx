// frontend/src/pages/SigninPage.tsx
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { User } from '../types/user';

const SigninPage = (): JSX.Element => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: Partial<User>): void => {
    console.log(data);
    toast.success('Signin form submitted!');
  };

  return (
    <>
      <h1>Signin</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} placeholder="Email" />
        <br />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
        />
        <br />
        <button type="submit">Signin</button>
      </form>
    </>
  );
};

export default SigninPage;
