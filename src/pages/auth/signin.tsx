import React, { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../_app";
import AppLayout from "@/components/app-layout/AppLayout";
import {
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { apiCall } from "@/utils/api-utils/api-helper";

const SignIn: NextPageWithLayout = () => {
  const [formData, setFormData] = useState({
    username: '',
    password:''
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const loginResponse = await apiCall('/auth/login', 'POST', formData)
    localStorage.setItem('access_token', loginResponse.access_token)
  };
  return (
    <div className="h-full flex justify-center items-center">
      <div className="p-3 flex flex-col justify-start items-start bg-white">
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value})}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value})}
            fullWidth
            margin="normal"
            required
          />
          <div className="mt-4">

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={false}
          >
            {false ? <CircularProgress size={24} /> : "Log In"}
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default SignIn;
