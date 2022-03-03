exports.ADMIN_INSERT ="INSERT INTO [dbo].[admin] (name,email,password) VALUES (@name,@email,@password)";
exports.QUERY_GETALLDATA = "SELECT name, male, female FROM [dbo].[admin];"
exports.QUERY_GETALLUSERNAME = "SELECT userName FROM [dbo].[admin];"
