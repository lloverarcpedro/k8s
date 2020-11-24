$script = <<-SCRIPT

# echo "Preparing local node_modules folder…"
# mkdir -p /home/vagrant/app/sdk/vagrant_node_modules
# chown vagrant:vagrant /home/vagrant/app/sdk/vagrant_node_modules

echo "cd /vagrant" >> /home/vagrant/.profile
echo "cd /vagrant" >> /home/vagrant/.bashrc
echo "All good!!"
SCRIPT

Vagrant.configure("2") do |config|

    ######## Support for express setup ########
    # Please read the instructions under setup/README.md
    # July 2020 - changed to 18.04
    
    # 1. Use this for "Standard setup"
    config.vm.box = "bento/ubuntu-18.04"

    # 2. Use this for "VirtualBox Express Setup"
    # config.vm.box = "acloudfan/hlfdev2.0-0"


    # Uncomment the lines below if you would like to protect the VM
    # config.ssh.username = 'vagrant'
    # config.ssh.password = 'vagrant'
    # config.ssh.insert_key = 'true'


    # Ports foward
    # For Orderer Container
    # config.vm.network "forwarded_port", guest: 7050, host: 7050
    # config.vm.network "forwarded_port", guest: 8050, host: 8050
    # config.vm.network "forwarded_port", guest: 9050, host: 9050
    # config.vm.network "forwarded_port", guest: 10050, host: 10050
    # config.vm.network "forwarded_port", guest: 11050, host: 11050

    # #Explorer
    # config.vm.network "forwarded_port", guest: 8080, host: 8080
    # #CouchDB
    # config.vm.network "forwarded_port", guest: 5984, host: 5984

    # #PostgresDB
    # config.vm.network "forwarded_port", guest: 5432, host: 5432
    # config.vm.network "forwarded_port", guest: 5442, host: 5442
    # config.vm.network "forwarded_port", guest: 5452, host: 5452
    # config.vm.network "forwarded_port", guest: 5462, host: 5462

    # #MySQL DB
    # config.vm.network "forwarded_port", guest: 3306, host:3306


    # # For Peer Container
    # config.vm.network "forwarded_port", guest: 7051, host: 7051
    # config.vm.network "forwarded_port", guest: 8051, host: 8051
    # config.vm.network "forwarded_port", guest: 9051, host: 9051
    # config.vm.network "forwarded_port", guest: 10051, host: 10051
    # config.vm.network "forwarded_port", guest: 11051, host: 11051
    # config.vm.network "forwarded_port", guest: 12051, host: 12051
    # config.vm.network "forwarded_port", guest: 13051, host: 13051

    # # Fabric CA Server
    # config.vm.network "forwarded_port", guest: 7052, host: 7052 #TLS CA
    # config.vm.network "forwarded_port", guest: 7053, host: 7053 #ORDERERS CA
    # config.vm.network "forwarded_port", guest: 7054, host: 7054 #HARVX CA
    # config.vm.network "forwarded_port", guest: 7055, host: 7055 #COMMODITY CA


    # config.vm.network "forwarded_port", guest: 9052, host: 9052
    # config.vm.network "forwarded_port", guest: 9053, host: 9053

    
    # config.vm.network "forwarded_port", guest: 10052, host: 10052
    # config.vm.network "forwarded_port", guest: 10053, host: 10053

   
    # config.vm.network "forwarded_port", guest: 11052, host: 11052
    # config.vm.network "forwarded_port", guest: 11053, host: 11053

   
    # config.vm.network "forwarded_port", guest: 12052, host: 12052
    # config.vm.network "forwarded_port", guest: 12053, host: 12053

   
    # config.vm.network "forwarded_port", guest: 13052, host: 13052
    # config.vm.network "forwarded_port", guest: 13053, host: 13053

    # # For Kafka Manager
    # config.vm.network "forwarded_port", guest: 9000, host: 9000

    # #Rabbit MQ
    # config.vm.network "forwarded_port", guest: 15672, host: 15672
    # config.vm.network "forwarded_port", guest: 5672, host: 5672
    # config.vm.network "forwarded_port", guest: 5671, host: 5671
    

    # This gets executed for both vm1 & vm2
    # config.vm.provision "shell", inline:  "echo 'All good'"
    config.vm.provision "shell", inline:  $script

    # config.vm.provision "shell", run: "always", inline: <<-SHELL
    #   mount --bind  /home/vagrant/app/sdk/node_modules /home/vagrant/app/sdk/vagrant_node_modules
    # SHELL
  
    # To use a diffrent Hypervisor create a section config.vm.provider
    # And comment out the following section
    # Configuration for Virtual Box
    config.vm.provider :virtualbox do |vb|
      # Change the memory here if needed - 3 Gb memory on Virtual Box VM
      #vb.customize ["modifyvm", :id, "--memory", "8192", "--cpus", "2"]
      vb.customize ["modifyvm", :id, "--memory", "4096", "--cpus", "4"]
      # Change this only if you need destop for Ubuntu - you will need more memory
      vb.gui = false
      # In case you have DNS issues
      # vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    end

    # Configuration for Windows Hyperv
    config.vm.provider :hyperv do |hv|
      # Change the memory here if needed - 2 Gb memory on Virtual Box VM
      hv.customize ["modifyvm", :id, "--memory", "3072", "--cpus", "1"]
      # Change this only if you need destop for Ubuntu - you will need more memory
      hv.gui = false
      # In case you have DNS issues
      # vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    end


  end