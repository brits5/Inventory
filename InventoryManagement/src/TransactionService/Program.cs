// TransactionService/Program.cs
using Microsoft.EntityFrameworkCore;
using TransactionService.Data;
using TransactionService.HttpClients;
using TransactionService.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<TransactionDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();

builder.Services.AddHttpClient<IProductHttpClient, ProductHttpClient>(client =>
{
    var productServiceUrl = builder.Configuration["Services:ProductServiceUrl"] ?? "http://localhost:5001";
    client.BaseAddress = new Uri(productServiceUrl);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.WebHost.UseUrls("http://*:80");
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();