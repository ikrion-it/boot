document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS (Mesmos dados do estado do React) ---
    const vehicles = [
        { id: 1, plate: 'ABC-1234', brand: 'Volvo', model: 'FH 540', year: 2022, currentKm: 85420, lastMaintenance: '2024-01-15', nextMaintenance: '2024-06-20', status: 'operational', manual: 'Volvo FH Series 2022' },
        { id: 2, plate: 'DEF-5678', brand: 'Mercedes-Benz', model: 'Actros 2646', year: 2021, currentKm: 123890, lastMaintenance: '2024-02-10', nextMaintenance: '2024-07-15', status: 'maintenance_soon', manual: 'Mercedes-Benz Actros 2021' },
        { id: 3, plate: 'GHI-9012', brand: 'Scania', model: 'R450', year: 2023, currentKm: 45670, lastMaintenance: '2024-03-05', nextMaintenance: '2024-08-25', status: 'operational', manual: 'Scania R-Series 2023' }
    ];

    const routes = [
        { id: 1, name: 'São Paulo → Rio de Janeiro', distance: 430, avgTripsPerMonth: 8, frequency: 'daily' },
        { id: 2, name: 'Belo Horizonte → Brasília', distance: 740, avgTripsPerMonth: 6, frequency: 'weekly' },
        { id: 3, name: 'Curitiba → Porto Alegre', distance: 710, avgTripsPerMonth: 4, frequency: 'bi-weekly' }
    ];

    const maintenanceItems = [
        { id: 1, vehicleId: 1, itemName: 'Troca de óleo do motor', intervalKm: 30000, intervalMonths: 6, lastServiceKm: 55420, nextServiceKm: 85420, status: 'due_soon', estimatedCost: 1250.00 },
        { id: 2, vehicleId: 1, itemName: 'Filtro de ar', intervalKm: 15000, intervalMonths: 3, lastServiceKm: 70420, nextServiceKm: 85420, status: 'due', estimatedCost: 320.00 },
        { id: 3, vehicleId: 2, itemName: 'Troca de óleo da transmissão', intervalKm: 60000, intervalMonths: 12, lastServiceKm: 63890, nextServiceKm: 123890, status: 'on_track', estimatedCost: 2100.00 }
    ];

    const quotations = [
        { id: 1, itemId: 1, supplier: 'AutoPeças Premium', price: 1180.00, deliveryDays: 2, rating: 4.8 },
        { id: 2, itemId: 1, supplier: 'Mecânica Center', price: 1250.00, deliveryDays: 1, rating: 4.5 },
        { id: 3, itemId: 2, supplier: 'Filtros Brasil', price: 290.00, deliveryDays: 3, rating: 4.7 }
    ];
    
    const navigationTabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'vehicles', label: 'Veículos' },
        { id: 'routes', label: 'Rotas' },
        { id: 'maintenance', label: 'Manutenção' },
        { id: 'quotations', label: 'Cotações' }
    ];

    let activeTab = 'dashboard';

    const mainContent = document.getElementById('main-content');
    const desktopNav = document.getElementById('desktop-nav');
    const mobileNav = document.getElementById('mobile-nav');

    // --- FUNÇÕES AUXILIARES ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'due': return 'bg-red-100 text-red-800';
            case 'due_soon': return 'bg-yellow-100 text-yellow-800';
            case 'on_track': return 'bg-green-100 text-green-800';
            case 'maintenance_soon': return 'bg-orange-100 text-orange-800';
            case 'operational': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getStatusLabel = (status) => {
        const labels = {
            operational: 'Operacional',
            maintenance_soon: 'Manutenção em breve',
            due: 'Vencido',
            due_soon: 'Vence em breve',
            on_track: 'Em dia',
        };
        return labels[status] || status;
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO DE HTML ---

    const renderNavigation = () => {
        desktopNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        navigationTabs.forEach(tab => {
            const isActive = activeTab === tab.id;
            const desktopClasses = `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`;
            const mobileClasses = `flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`;

            const button = `<button data-tab="${tab.id}" class="${desktopClasses}">${tab.label}</button>`;
            const mobileButton = `<button data-tab="${tab.id}" class="${mobileClasses}">${tab.label}</button>`;

            desktopNav.innerHTML += button;
            mobileNav.innerHTML += mobileButton;
        });
        
        // Adiciona os event listeners aos novos botões
        document.querySelectorAll('nav button').forEach(button => {
            button.addEventListener('click', () => {
                activeTab = button.dataset.tab;
                render();
            });
        });
    };
    
    const renderDashboard = () => {
        const vehiclesDueSoon = vehicles.filter(v => v.status === 'maintenance_soon').length;
        const maintenanceDue = maintenanceItems.filter(m => m.status === 'due' || m.status === 'due_soon').length;
        
        const attentionVehiclesHTML = vehicles
            .filter(v => v.status !== 'operational')
            .map(vehicle => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-semibold text-gray-800">${vehicle.plate}</p>
                    <p class="text-sm text-gray-600">${vehicle.brand} ${vehicle.model}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-800">${vehicle.currentKm.toLocaleString()} km</p>
                    <p class="text-sm text-gray-600">Próx: ${vehicle.nextMaintenance}</p>
                  </div>
                </div>
            `).join('');

        const priorityMaintenanceHTML = maintenanceItems
            .filter(m => m.status === 'due')
            .map(item => {
                const vehicle = vehicles.find(v => v.id === item.vehicleId);
                return `
                  <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <p class="font-semibold text-red-800">${item.itemName}</p>
                      <p class="text-sm text-red-600">Veículo: ${vehicle?.plate}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-red-800">R$ ${item.estimatedCost.toFixed(2)}</p>
                      <button class="mt-2 bg-red-600 text-white text-sm py-1 px-3 rounded hover:bg-red-700 transition-colors">Agendar</button>
                    </div>
                  </div>
                `;
            }).join('');

        mainContent.innerHTML = `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white"><h3 class="text-lg font-medium opacity-90">Total de Veículos</h3><p class="text-3xl font-bold mt-2">${vehicles.length}</p></div>
                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"><h3 class="text-lg font-medium opacity-90">Rotas Cadastradas</h3><p class="text-3xl font-bold mt-2">${routes.length}</p></div>
                    <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white"><h3 class="text-lg font-medium opacity-90">Manutenções em Breve</h3><p class="text-3xl font-bold mt-2">${vehiclesDueSoon}</p></div>
                    <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white"><h3 class="text-lg font-medium opacity-90">Itens Vencidos</h3><p class="text-3xl font-bold mt-2">${maintenanceDue}</p></div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow-md p-6"><h2 class="text-xl font-bold text-gray-800 mb-4">Veículos que precisam de atenção</h2><div class="space-y-4">${attentionVehiclesHTML}</div></div>
                    <div class="bg-white rounded-lg shadow-md p-6"><h2 class="text-xl font-bold text-gray-800 mb-4">Manutenções prioritárias</h2><div class="space-y-4">${priorityMaintenanceHTML}</div></div>
                </div>
            </div>
        `;
    };
    
    const renderVehicles = () => {
        const vehiclesHTML = vehicles.map(vehicle => `
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-800">${vehicle.plate}</h3>
                  <p class="text-gray-600">${vehicle.brand} ${vehicle.model} (${vehicle.year})</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.status)}">${getStatusLabel(vehicle.status)}</span>
              </div>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div><p class="text-sm text-gray-500">Quilometragem atual</p><p class="font-semibold">${vehicle.currentKm.toLocaleString()} km</p></div>
                <div><p class="text-sm text-gray-500">Próxima manutenção</p><p class="font-semibold">${vehicle.nextMaintenance}</p></div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200"><p class="text-sm text-gray-600">Manual: ${vehicle.manual}</p></div>
            </div>
        `).join('');

        mainContent.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Gerenciamento de Veículos</h2>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">+ Adicionar Veículo</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${vehiclesHTML}</div>
            </div>
        `;
    };

    const renderRoutes = () => {
        const routesHTML = routes.map(route => `
            <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 class="text-lg font-bold text-gray-800 mb-3">${route.name}</h3>
              <div class="space-y-2">
                <div class="flex justify-between"><span class="text-gray-600">Distância:</span><span class="font-medium">${route.distance.toLocaleString()} km</span></div>
                <div class="flex justify-between"><span class="text-gray-600">Viagens/mês:</span><span class="font-medium">${route.avgTripsPerMonth}</span></div>
                <div class="flex justify-between"><span class="text-gray-600">Frequência:</span><span class="font-medium capitalize">${route.frequency}</span></div>
              </div>
            </div>
        `).join('');
        
        mainContent.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Rotas Cadastradas</h2>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">+ Adicionar Rota</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${routesHTML}</div>
            </div>
        `;
    };
    
    const renderMaintenance = () => {
        const maintenanceHTML = maintenanceItems.map(item => {
            const vehicle = vehicles.find(v => v.id === item.vehicleId);
            const relatedQuotations = quotations.filter(q => q.itemId === item.id);
            const bestQuote = relatedQuotations.reduce((prev, current) => (!prev || current.price < prev.price) ? current : prev, null);
            
            let bestQuoteHTML = '';
            if (bestQuote) {
                bestQuoteHTML = `
                  <div class="bg-blue-50 p-3 rounded-lg mt-4">
                    <h4 class="font-semibold text-blue-800 mb-2">Melhor cotação:</h4>
                    <div class="flex justify-between text-sm"><span>${bestQuote.supplier}</span><span class="font-bold text-blue-800">R$ ${bestQuote.price.toFixed(2)}</span></div>
                    <div class="flex justify-between text-xs text-blue-700 mt-1"><span>Entrega: ${bestQuote.deliveryDays} dias</span><span>Avaliação: ${bestQuote.rating} ★</span></div>
                    <button class="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">Solicitar Orçamento</button>
                  </div>`;
            }

            return `
                <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div class="flex justify-between items-start mb-4">
                        <div><h3 class="text-lg font-bold text-gray-800">${item.itemName}</h3><p class="text-gray-600">Veículo: ${vehicle.plate}</p></div>
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}">${getStatusLabel(item.status)}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div><p class="text-sm text-gray-500">Intervalo (km)</p><p class="font-semibold">${item.intervalKm.toLocaleString()} km</p></div>
                        <div><p class="text-sm text-gray-500">Próx. serviço</p><p class="font-semibold">${item.nextServiceKm.toLocaleString()} km</p></div>
                    </div>
                    ${bestQuoteHTML}
                </div>
            `;
        }).join('');
        
        mainContent.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Itens de Manutenção</h2>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">+ Adicionar Item</button>
                </div>
                <div class="space-y-6">${maintenanceHTML}</div>
            </div>
        `;
    };
    
    const renderQuotations = () => {
        const quotationsRowsHTML = quotations.map(quote => {
            const item = maintenanceItems.find(i => i.id === quote.itemId);
            return `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item?.itemName}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quote.supplier}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">R$ ${quote.price.toFixed(2)}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quote.deliveryDays} dias</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quote.rating} ★</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-4">Detalhes</button>
                    <button class="text-green-600 hover:text-green-900">Aprovar</button>
                  </td>
                </tr>
            `;
        }).join('');
        
        mainContent.innerHTML = `
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Cotações de Fornecedores</h2>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avaliação</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">${quotationsRowsHTML}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    };

    // --- RENDERIZADOR PRINCIPAL ---
    const render = () => {
        renderNavigation(); // Sempre atualiza a navegação para refletir o estado ativo

        switch (activeTab) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'vehicles':
                renderVehicles();
                break;
            case 'routes':
                renderRoutes();
                break;
            case 'maintenance':
                renderMaintenance();
                break;
            case 'quotations':
                renderQuotations();
                break;
        }
    };

    // --- INICIALIZAÇÃO ---
    render();
});