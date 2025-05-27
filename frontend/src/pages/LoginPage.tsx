// Ce composant représente le formulaire de connexion avec React Hook Form
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    toast.success('Login form submitted!');
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} placeholder="Email" /><br />
        <input {...register('password')} type="password" placeholder="Password" /><br />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginPage;
