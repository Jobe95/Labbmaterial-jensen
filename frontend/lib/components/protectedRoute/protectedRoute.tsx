import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice';

type Props = {
  children: JSX.Element | JSX.Element[];
  role: 'NORMAL_USER' | 'ADMIN_USER';
};

export const ProtectedRoute = ({ children, role }: Props) => {
  const user = useSelector(selectUser);

  if (!user?.roles?.includes(role)) {
    return <></>;
  }

  return <>{children}</>;
};
