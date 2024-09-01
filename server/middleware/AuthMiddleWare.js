import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt; // Get the token from cookies

  if (!token) { // If no token, return a 401 error
    return response.status(401).send("You are not authenticated!");
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) { // If token verification fails, return a 403 error
      return response.status(403).send("Token is not valid!");
    }

    request.userId = payload.userId; // Attach the userId from the token payload to the request
    next(); // Continue to the next middleware or route handler
  });
};
