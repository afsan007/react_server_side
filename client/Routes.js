// import React from 'react';
import Home from "./containers/home";
import usersList from "./containers/usersList";
import adminsList from "./containers/adminsList";
import Root from "./RootPage";
import NotFoundPage from "./containers/notFoundPage";
import SignIn from "./containers/userManagement/SignIn";
import SignUp from "./containers/userManagement/SignUp";
import resetPassword from "./containers/userManagement/resetPassword/resetPassword";
import requestToReset from "./containers/userManagement/resetPassword/requestToReset";

export default [
	{
		...Root,
		path: "/",
		routes: [
			{
				path: "/users",
				...usersList
			},
			{
				path: "/admins",
				...adminsList
			},
			{
				path: "/signin",
				...SignIn
			},
			{
				path: "/signup",
				...SignUp
			},
			{
				path: "/request_resetPass",
				...requestToReset
			},
			{
				path: "/resetPassword",
				...resetPassword
			},
			{
				component: Home,
				path: "/"
			},
			{
				...NotFoundPage
			}
		]
	}
];
