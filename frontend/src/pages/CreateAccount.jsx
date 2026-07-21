import { useState } from "react";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("dob", dob);
    formData.append("about_you", aboutYou);
    formData.append("file", file);

    await fetch("http://localhost:8000/api/csrf/", {
      credentials: "include",
    });

    function getCookie(name) {
      const cookies = document.cookie.split(";");

      for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }

      return null;
    }

    const csrfToken = getCookie("csrftoken");

    try {
      const response = await fetch("http://localhost:8000/api/create_users", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: formData,
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert("Account Created Successfully!");
      } else {
        alert(data.message || "Failed to create account");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>About You</label>
            <textarea
              placeholder="Tell us about yourself"
              value={aboutYou}
              onChange={(e) => setAboutYou(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
