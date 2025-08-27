import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { setUserData } from "@/reducers/auth/authSlice";
import * as API from "@/apis/index";
import { useNavigate } from "react-router-dom";

export default function Login_Page() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // states
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // redirect by role
  const redirectUser = (role: string) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "hr":
        navigate("/hr");
        break;
      case "employee":
        navigate("/employee");
        break;
      case "candidate":
        navigate("/candidate");
        break;
      default:
        navigate("/");
    }
  };

  // ---- Sign In Handler ----
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      const { data } = await API.login({
        email: signinEmail,
        password: signinPassword,
      });
      localStorage.setItem('accessToken' , data.token)
      dispatch(setUserData(data.user));
      redirectUser(data.user.role); // redirect after login
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---- Sign Up Handler ----
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      const { data } = await API.register({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
      });
      dispatch(setUserData(data.user));
      redirectUser(data.user.role); // redirect after signup
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Welcome to Eraah
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* ---- Sign In ---- */}
            <TabsContent value="signin">
              <form className="space-y-4" onSubmit={handleSignin}>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                  />
                </div>
                {errorMsg && (
                  <p className="text-red-500 text-sm">{errorMsg}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* ---- Sign Up ---- */}
            <TabsContent value="signup">
              <form className="space-y-4" onSubmit={handleSignup}>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select onValueChange={(val) => setSignupRole(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidate">Candidate</SelectItem>
                      {/* <SelectItem value="hr">HR</SelectItem> */}
                      {/* <SelectItem value="admin">Admin</SelectItem> */}
                      {/* <SelectItem value="employee">Employee</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                {errorMsg && (
                  <p className="text-red-500 text-sm">{errorMsg}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
