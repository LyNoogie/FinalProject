﻿// <auto-generated />
using System;
using KKGame.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace KKGame.Migrations
{
    [DbContext(typeof(GameContext))]
    [Migration("20191205070108_UpdateInitilizer")]
    partial class UpdateInitilizer
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("KKGame.Models.HighScores", b =>
                {
                    b.Property<int>("HighScoreID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<int>("Score")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("HighScoreID");

                    b.ToTable("HighScores");
                });

            modelBuilder.Entity("KKGame.Models.Words", b =>
                {
                    b.Property<int>("WordID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("IsUsed")
                        .HasColumnType("bit");

                    b.Property<string>("Word")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("WordID");

                    b.ToTable("Words");
                });
#pragma warning restore 612, 618
        }
    }
}