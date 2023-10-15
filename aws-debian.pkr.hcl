packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9" #Debian 12 64bit
}

variable "subnet_id" {
  type    = string
  default = "subnet-02926d9d8ad87b0ff"
}

source "amazon-ebs" "my-ami" {
  ami_name        = "my-ami-node${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "this ami has node and postgres installed"
  ami_users       = ["363018103404", "714147557017"]
  region          = "${var.aws_region}"
  instance_type   = "t2.micro"
  source_ami       = "${var.source_ami}"
  ssh_username    = "${var.ssh_username}"
  subnet_id       = "${var.subnet_id}"
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "shell" {
    inline = [
      "sudo apt update",
      "sudo apt-get upgrade -y",
      "sudo apt-get install nginx -y",
      "sudo apt-get clean",
      "sudo apt install nodejs npm -y",
      "sudo apt install postgresql postgresql-contrib -y"
    ]
  }
}