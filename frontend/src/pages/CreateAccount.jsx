import { useState } from "react";

function CreateAccount() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log({
      userId,
      password,
      file,
    });

    alert("Account Created Successfully!");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>User ID</label>
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
