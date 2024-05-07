# Use an nginx base image
FROM nginx:alpine

# Copy the built React app to the NGINX HTML directory
COPY build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]
