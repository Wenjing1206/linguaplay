import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post(
        '/api/auth/login',
        { username },
        { withCredentials: true }
      );
  
      if (res.data.success) {
        navigate('/lobby'); // 登录成功后跳转
      } else {
        setError('登录失败，请重试');
      }
    } catch (err) {
      setError(err.response?.data?.error || '登录失败，请稍后再试');
    }
  };
  

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">登录 Login</h1>

      <input
        type="text"
        placeholder="请输入用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
      />

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        登录 / 注册
      </button>
    </div>
  );
}

