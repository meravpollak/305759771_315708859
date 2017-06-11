CREATE TABLE [dbo].[Clients](
	[ClientID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](50) NULL,
	[Adress] [nvarchar](50) NULL,
	[City] [nvarchar](50) NULL,
	[Country] [nvarchar](50) NULL,
	[Cellular] [nvarchar](50) NULL,
	[Mail] [nvarchar](50) NULL,
	[CreditCardNumber] [nvarchar](50) NULL,
	[isAdmin] [int] NULL DEFAULT ((0)),
	[Question] [nvarchar](50) NOT NULL,
	[Answer] [nvarchar](50) NOT NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
 CONSTRAINT [aaaaaClients_PK] PRIMARY KEY NONCLUSTERED 
(
	[ClientID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)

CREATE TABLE [dbo].[CategoriesOfInterest](
	[ClientID] [int] NOT NULL DEFAULT ((0)),
	[CategoryID] [int] NOT NULL DEFAULT ((0)),
 CONSTRAINT [aaaaaCategoriesOfInterest_PK] PRIMARY KEY NONCLUSTERED 
(
	[ClientID] ASC,
	[CategoryID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)

CREATE TABLE [dbo].[Orders](
	[OrderID] [int] NOT NULL DEFAULT ((0)),
	[ClientID] [int] NULL DEFAULT ((0)),
	[OrderDate] [datetime2] NULL,
	[ShipmentDate] [datetime2] NULL,
	[Currency] [nvarchar](50) NULL,
	[TotalAmount] [nvarchar](50) NULL,
 CONSTRAINT [aaaaaOrders_PK] PRIMARY KEY NONCLUSTERED 
(
	[OrderID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)

CREATE TABLE [dbo].[Products](
	[ProductID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Description] [nvarchar](50) NULL,
	[CategoryID] [int] NOT NULL DEFAULT ((0)),
	[AuthorID] [int] NULL DEFAULT ((0)),
	[Price] [int] NULL DEFAULT ((0)),
	[StokAmount] [int] NULL DEFAULT ((0)),
	[Date] [datetime2] NULL,
 CONSTRAINT [aaaaaBooks_PK] PRIMARY KEY NONCLUSTERED 
(
	[ProductID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)

CREATE TABLE [dbo].[OrderProducts](
	[OrderID] [int] NOT NULL DEFAULT ((0)),
	[ProductID] [int] NOT NULL DEFAULT ((0)),
	[Amount] [int] NULL DEFAULT ((0)),
	[OrderDate] [datetime2] NULL,
 CONSTRAINT [aaaaaBooksInOrders_PK] PRIMARY KEY NONCLUSTERED 
(
	[OrderID] ASC,
	[ProductID] ASC
)WITH (STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF)
)

