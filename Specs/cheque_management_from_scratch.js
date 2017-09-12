//From scratch: Will create a role "Administrator" and a headquarter office
//Prerequisite: No tasks need to be executed in order to activate a customer
//ToDo: Figure out which roles best to use for which kind of actions instead of using employee with "Administrator" role

var helper = require('../helper.js');
var Login = require('../Pages/Login.js');
var Employees = require('../Pages/Employees.js');
var Common = require('../Pages/Common.js');
var Offices = require('../Pages/Offices');
var Roles = require('../Pages/Roles');
var Teller = require('../Pages/Teller');
var Customers = require('../Pages/Customers');
var Deposits = require('../Pages/Deposits');
var Accounting = require('../Pages/Accounting');
var Cheques = require('../Pages/Cheques');


describe('cheque_management', function() {
    var EC = protractor.ExpectedConditions;
    employeeIdentifier = helper.getRandomString(6);
    officeIdentifier = helper.getRandomString(6);
    officeIdentifier2 = helper.getRandomString(12);
    tellerIdentifier = helper.getRandomString(4);
    customerAccount = helper.getRandomString(5);
    customerAccount2 = helper.getRandomString(5);
    depositIdentifier = helper.getRandomString(5);
    depositName = helper.getRandomString(8);
    tellerAccount = helper.getRandomString(4);
    chequesReceivableAccount = helper.getRandomString(4);
    revenueAccount = helper.getRandomString(4);
    loanShortName = helper.getRandomString(6);
    taskIdentifier = helper.getRandomString(3);
    loanAccountShortName =  helper.getRandomString(4);
    branchSortCode = helper.getRandomString(11);
    branchSortCode2 = helper.getRandomString(11);

    it('should create a new administrator role', function () {
        Common.waitForThePageToFinishLoading();
        Roles.clickCreateNewRoleFromQuickAccess();
        Roles.enterTextIntoRoleIdentifierInput("Administrator");
        Roles.verifyCardHasTitleCreateRole();
        Roles.selectCheckboxToGiveUserAllPermissions();
        Roles.clickEnabledSaveRoleButton();
        Common.verifyMessagePopupIsDisplayed("Role is going to be saved");
        Roles.verifyCardHasTitleManageRoles();
    });
    it('should create a new teller role', function () {
       //TBD: teller transaction should be executed by employee with role teller
    });
    it('should create new accounts', function () {
        Accounting.goToAccountingViaSidePanel();
        Common.clickLinkShowForRowWithId("7000");
        Common.clickLinkShowForRowWithId("7300");
        Accounting.clickCreateNewAccountInLedger("7300");
        Accounting.enterTextIntoAccountIdentifierInputField(tellerAccount);
        Accounting.verifyRadioAssetToBeSelected();
        Accounting.verifyRadioAssetToBeDisabled();
        Accounting.enterTextIntoAccountNameInputField("My teller");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("7200");
        Accounting.clickCreateNewAccountInLedger("7200");
        Accounting.enterTextIntoAccountIdentifierInputField(chequesReceivableAccount);
        Accounting.verifyRadioAssetToBeSelected();
        Accounting.verifyRadioAssetToBeDisabled();
        Accounting.enterTextIntoAccountNameInputField("Cheques Receivable");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
        Accounting.goToAccountingViaSidePanel();
        Common.clickLinkShowForRowWithId("1000");
        Common.clickLinkShowForRowWithId("1300");
        Accounting.clickCreateNewAccountInLedger("1300");
        Accounting.enterTextIntoAccountIdentifierInputField(revenueAccount);
        Accounting.verifyRadioRevenueToBeSelected();
        Accounting.enterTextIntoAccountNameInputField("Revenue from deposit charges");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
    });
    it('should create a new employee with administrator permissions', function () {
        Employees.goToManageEmployeesViaSidePanel();
        Employees.createEmployee(employeeIdentifier, "Kate", "Atkinson", "Administrator", "abc123!!");
        Login.signOut();
        Login.logInForFirstTimeWithTenantUserAndPassword("playground", employeeIdentifier, "abc123!!", "abc123??");
    });

    it('should create a headquarter office', function () {
        Offices.goToManageOfficesViaSidePanel();
        Offices.verifyNoHeadquarterExistingYet();
        Offices.clickButtonCreateHeadquarter();
        Offices.verifyCardHasTitleCreateOffice();
        Offices.enterTextIntoOfficeIdentifierInputField("hqo1");
        Offices.enterTextIntoOfficeNameInputField("Headquarter Office Playground");
        Offices.clickEnabledContinueButtonForOfficeDetails();
        Offices.clickEnabledCreateOfficeButton();
        Common.verifyMessagePopupIsDisplayed("Office is going to be saved");
    });
    it('should create a new branch office and a teller for the branch office', function () {
        Offices.clickButtonCreateNewOffice();
        Offices.verifyCardHasTitleCreateOffice();
        Offices.enterTextIntoOfficeIdentifierInputField(officeIdentifier);
        Offices.enterTextIntoOfficeNameInputField("Branch " + officeIdentifier);
        Offices.clickEnabledContinueButtonForOfficeDetails();
        Offices.clickEnabledCreateOfficeButton();
        Common.verifyMessagePopupIsDisplayed("Office is going to be saved");
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(officeIdentifier);
        Common.verifyFirstRowOfSearchResultHasTextAsId(officeIdentifier);
        Common.clickLinkShowForFirstRowInTable();
        Offices.goToManageTellersForOfficeByIdentifier(officeIdentifier);
        Offices.clickCreateTellerForOfficeByIdentifier(officeIdentifier);
        Offices.enterTextIntoTellerNumberInputField(tellerIdentifier);
        Offices.enterTextIntoPasswordInputField("qazwsx123!!");
        Offices.enterTextIntoCashWithdrawalLimitInputField("1000");
        Offices.enterTextIntoTellerAccountInputFieldAndSelectMatchingEntry(tellerAccount);
        Offices.enterTextIntoVaultAccountInputFieldAndSelectMatchingEntry("7351");
        Offices.enterTextIntoChequesReceivableAccountInputFieldAndSelectMatchingEntry(chequesReceivableAccount);
        Offices.clickEnabledCreateTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller is going to be saved");
        //workaround for current bug that teller is not always listed immediately
        Common.clickBackButtonInTitleBar();
        Offices.goToManageTellersForOfficeByIdentifier(officeIdentifier);
        //Offices.verifyTellerStatusIs("CLOSED");
        Common.clickLinkShowForFirstRowInTable();
    });
    it('should open the teller and assign it to an employee', function () {
        Offices.clickActionOpenForTellerOfOffice(tellerIdentifier, officeIdentifier);
        Offices.enterTextIntoAssignedEmployeeInputField(employeeIdentifier);
        Offices.selectOptionInListByName("Atkinson, Kate");
        Offices.clickEnabledOpenTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller is going to be updated");
        Offices.verifyTellerStatusIs("OPEN");
    });
    it('should create customer and activate customer', function () {
        Customers.goToManageCustomersViaSidePanel();
        Customers.verifyCardHasTitleManageMembers();
        Customers.clickButtonOrLinkCreateNewCustomer();
        Customers.verifyCardHasTitleCreateMember();
        Customers.enterTextIntoAccountInputField(customerAccount);
        Customers.enterTextIntoFirstNameInputField("Thomas");
        Customers.enterTextIntoLastNameInputField("Pynchon");
        Customers.enterTextIntoDayOfBirthInputField("9211978");
        Customers.verifyIsMemberCheckboxSelected();
        Customers.clickEnabledContinueButtonForCustomerDetails();
        Customers.enterTextIntoStreetInputField("800 Chatham Road #326");
        Customers.enterTextIntoCityInputField("Winston-Salem");
        Customers.selectCountryByName("Germany");
        Customers.clickEnabledContinueButtonForCustomerAddress();
        Customers.clickEnabledCreateCustomerButton();
        Common.verifyMessagePopupIsDisplayed("Member is going to be saved")
        Customers.verifyCardHasTitleManageMembers();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForFirstRowInTable();
        Customers.verifyMemberHasStatusInactive();
        Customers.clickButtonGoToTasks();
        Customers.clickButtonActivate();
        Common.verifyMessagePopupIsDisplayed("Command is going to be executed");
        Customers.verifyMemberHasStatusActive();
    });
    it('should create a deposit product and enable the product', function () {
        Deposits.goToDepositsViaSidePanel();
        Deposits.verifyCardHasTitle("Manage deposit products");
        Deposits.clickButtonCreateDepositAccount();
        Deposits.verifyCardHasTitle("Create new deposit product");
        Deposits.enterTextIntoShortNameInputField(depositIdentifier);
        Deposits.verifyRadioCheckingIsSelected();
        Deposits.enterTextIntoNameInputField(depositName);
        Deposits.enterTextIntoMinimumBalanceInputField("100");
        Deposits.verifyRadioAnnuallyIsSelected();
        Deposits.verifyCheckboxFlexibleInterestNotChecked();
        Deposits.enterTextIntoInterestInputField("3");
        Deposits.verifyFixedTermToggleSetToOff();
        Deposits.verifyTermPeriodInputFieldIsDisabled();
        Deposits.verifyRadioButtonsMonthAndYearDisabled();
        Deposits.toggleFixedTermToOn();
        Deposits.verifyTermPeriodInputFieldIsEnabled();
        Deposits.verifyRadioButtonsMonthAndYearEnabled();
        Deposits.selectRadioButtonYear();
        Deposits.enterTextIntoCashAccountInputField("7352");
        Deposits.enterTextIntoExpenseAccountInputField("2820");
        Deposits.enterTextIntoAccrueAccountInputField("8202");
        Deposits.enterTextIntoEquityLedgerInputField("9100");
        Deposits.enterTextIntoTermPeriodInputField("5");
        Deposits.selectRadioButtonYear();
        Deposits.clickEnabledContinueButtonForProductDetails();
        Deposits.clickEnabledCreateProductButton();
        Common.verifyMessagePopupIsDisplayed("Product is going to be saved");
        Deposits.verifyCardHasTitle("Manage deposit products");
        Common.clickLinkShowForRowWithId(depositIdentifier);
        Deposits.verifyProductHasStatusDisabled();
        Deposits.clickButtonEnableProduct();
        Common.verifyMessagePopupIsDisplayed("Product is going to be updated");
        Deposits.verifyProductHasStatusEnabled();
    });
    it('should assign deposit product to the customer and open the account', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickManageDepositAccountsForMember(customerAccount);
        Customers.clickCreateDepositAccountForMember(customerAccount);
        Customers.selectProduct(depositName);
        Customers.clickEnabledButtonCreateDepositAccount();
        Common.verifyMessagePopupIsDisplayed("Deposit account is going to be saved");
        //might not be in list immediately always
        Common.clickBackButtonInTitleBar();
        Customers.clickManageDepositAccountsForMember(customerAccount);
        Common.clickLinkShowForRowWithId(depositIdentifier);
        Customers.verifyDepositAccountHasStatus("PENDING");
        Customers.verifyDepositAccountBalanceIs("0.00");
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoTellerNumberInputField(tellerIdentifier);
        Teller.enterTextIntoPasswordInputField("qazwsx123!!");
        Teller.clickEnabledUnlockTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller drawer unlocked");
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Thomas Pynchon");
        Teller.clickOnOpenAccountForCustomer(customerAccount);
        Teller.verifyCardTitleIs("Teller transaction");
        Teller.selectAccountToBeAffected(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Teller.enterTextIntoAmountInputField("500");
        Teller.clickEnabledCreateTransactionButton();
        Teller.verifyTransactionAmount("500");
        Teller.clickEnabledConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('customer should be able to cash cheque - cheque is not open/not on us', function () {
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("123456");
        Cheques.enterTextIntoBranchSortCodeInputField(branchSortCode);
        Cheques.enterTextIntoAccountNumberInputField("789789");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsDisplayedIfIssuingBankCouldNotBeDetermined();
        //Issuing Bank/Issuer show error
        Cheques.verifyIssuingBankHasError();
        Cheques.verifyIssuerHasError();
        Cheques.enterTextIntoIssuingBankInputField("BoA");
        Cheques.enterTextIntoIssuerInputField("Paul Auster");
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("992017");
        Cheques.verifyWarningIsDisplayedIfChequeIsNotOpen();
        Cheques.enterTextIntoAmountInputField("5000");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyTransactionAmount("5000");
        Cheques.clickConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('customer should be able to cash cheque - cheque is open/not on us', function () {
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("123456");
        Cheques.enterTextIntoBranchSortCodeInputField(branchSortCode2);
        Cheques.enterTextIntoAccountNumberInputField("789789");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsDisplayedIfIssuingBankCouldNotBeDetermined();
        //Issuing Bank/Issuer show error
        Cheques.enterTextIntoIssuingBankInputField("BoA");
        Cheques.enterTextIntoIssuerInputField("Paul Auster");
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("9122017");
        Cheques.checkCheckboxIsChequeOpen();
        Cheques.verifyWarningIsNotDisplayedIfChequeIsOpen();
        Cheques.enterTextIntoAmountInputField("300");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyTransactionAmount("300");
        Cheques.clickConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('journal entries for transactions should be listed as expected', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00001");
        Accounting.clickSearchButton();
        Accounting.verifyFirstJournalEntry("Account Opening", "Amount: 500.00");
        Accounting.verifySecondJournalEntry("Order Cheque", "Amount: 5,000.00");
        Accounting.verifyThirdJournalEntry("Open Cheque", "Amount: 300.00");
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("7000");
        Common.clickLinkShowForRowWithId("7200");
        Common.clickLinkShowForRowWithId(chequesReceivableAccount);
        Accounting.viewAccountEntriesForAccount(chequesReceivableAccount);
        Accounting.verifyTransactionTypeForRow("DEBIT", 1);
        Accounting.verifyTransactionMessageForRow("ORCQ", 1);
        Accounting.verifyTransactionAmountForRow("5000", 1);
        Accounting.verifyTransactionBalanceForRow("5000", 1);
        Accounting.verifyTransactionTypeForRow("DEBIT", 2);
        Accounting.verifyTransactionMessageForRow("OPCQ", 2);
        Accounting.verifyTransactionAmountForRow("300", 2);
        Accounting.verifyTransactionBalanceForRow("5300", 2);
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("9000");
        Common.clickLinkShowForRowWithId("9100");
        Common.clickLinkShowForRowWithId(customerAccount + ".9100.00001");
        Accounting.viewAccountEntriesForAccount(customerAccount + ".9100.00001");
        Accounting.verifyTransactionTypeForRow("CREDIT", 2);
        Accounting.verifyTransactionMessageForRow("ORCQ", 2);
        Accounting.verifyTransactionAmountForRow("5000", 2);
        Accounting.verifyTransactionBalanceForRow("5500", 2);
        Accounting.verifyTransactionTypeForRow("CREDIT", 3);
        Accounting.verifyTransactionMessageForRow("OPCQ", 3);
        Accounting.verifyTransactionAmountForRow("300", 3);
        Accounting.verifyTransactionBalanceForRow("5800", 3);
    });
    it('cheques should be pending clearance - approve first cheque/cancel second cheque', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToChequeClearing();
        Cheques.verifyStateForChequeWithIdentifier("PENDING", "123456~" + branchSortCode + "~789789");
        Cheques.verifyStateForChequeWithIdentifier("PENDING", "123456~" + branchSortCode2 + "~789789");
        Cheques.verifyDateIssuedForChequeWithIdentifier("9/9/2017", "123456~" + branchSortCode + "~789789");
        Cheques.verifyDateIssuedForChequeWithIdentifier("9/12/2017", "123456~" + branchSortCode + "~789789");
        Cheques.clickButtonApproveForChequeWithIdentifier("123456~" + branchSortCode + "~789789");
        Cheques.cancelAction();
        Cheques.clickButtonApproveForChequeWithIdentifier("123456~" + branchSortCode + "~789789");
        Cheques.confirmAction();
        Cheques.verifyStateForChequeWithIdentifier("PROCESSED", "123456~" + branchSortCode + "~789789");
        Cheques.clickButtonCancelForChequeWithIdentifier("123456~" + branchSortCode2 + "~789789");
        Cheques.confirmAction();
        Cheques.verifyStateForChequeWithIdentifier("CANCELED", "123456~" + branchSortCode2 + "~789789");
    });
    it('cheque should have been reverted as expected', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00001");
        Accounting.clickSearchButton();
        Accounting.verifyFourthJournalEntry("Cheque Reversal", "Amount: 300.00");
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("7000");
        Common.clickLinkShowForRowWithId("7200");
        Common.clickLinkShowForRowWithId(chequesReceivableAccount);
        Accounting.viewAccountEntriesForAccount(chequesReceivableAccount);
        Accounting.verifyTransactionTypeForRow("CREDIT", 3);
        Accounting.verifyTransactionMessageForRow("CQRV", 3);
        Accounting.verifyTransactionAmountForRow("300", 3);
        Accounting.verifyTransactionBalanceForRow("5000", 3);
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("9000");
        Common.clickLinkShowForRowWithId("9100");
        Common.clickLinkShowForRowWithId(customerAccount + ".9100.00001");
        Accounting.viewAccountEntriesForAccount(customerAccount + ".9100.00001");
        Accounting.verifyTransactionTypeForRow("DEBIT", 4);
        Accounting.verifyTransactionMessageForRow("CQRV", 4);
        Accounting.verifyTransactionAmountForRow("300", 4);
        Accounting.verifyTransactionBalanceForRow("5500", 4);
    });
    it('should create another customer', function () {
        Customers.goToManageCustomersViaSidePanel();
        Customers.verifyCardHasTitleManageMembers();
        Customers.clickButtonOrLinkCreateNewCustomer();
        Customers.verifyCardHasTitleCreateMember();
        Customers.enterTextIntoAccountInputField(customerAccount2);
        Customers.enterTextIntoFirstNameInputField("Cormac");
        Customers.enterTextIntoLastNameInputField("McCarthy");
        Customers.enterTextIntoDayOfBirthInputField("7281958");
        Customers.verifyIsMemberCheckboxSelected();
        Customers.clickEnabledContinueButtonForCustomerDetails();
        Customers.enterTextIntoStreetInputField("800 Chatham Road #326");
        Customers.enterTextIntoCityInputField("Winston-Salem");
        Customers.selectCountryByName("Germany");
        Customers.clickEnabledContinueButtonForCustomerAddress();
        Customers.clickEnabledCreateCustomerButton();
        Common.verifyMessagePopupIsDisplayed("Member is going to be saved")
        Customers.verifyCardHasTitleManageMembers();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount2);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount2);
    });
    it('should activate the customer', function () {
        Common.clickLinkShowForFirstRowInTable();
        Customers.verifyMemberHasStatusInactive();
        Customers.clickButtonGoToTasks();
        Customers.clickButtonActivate();
        Common.verifyMessagePopupIsDisplayed("Command is going to be executed");
        Customers.verifyMemberHasStatusActive();
    });
    it('should assign deposit product to customer and issue cheques to customer', function () {
        Customers.clickManageDepositAccountsForMember(customerAccount2);
        Customers.clickCreateDepositAccountForMember(customerAccount2);
        Customers.selectProduct(depositName);
        Customers.clickEnabledButtonCreateDepositAccount();
        Common.verifyMessagePopupIsDisplayed("Deposit account is going to be saved");
        //might not be in list immediately always
        Common.clickBackButtonInTitleBar();
        Customers.clickManageDepositAccountsForMember(customerAccount2);
        Common.clickLinkShowForRowWithId(depositIdentifier);
        Customers.verifyDepositAccountHasStatus("PENDING");
        Customers.verifyDepositAccountBalanceIs("0.00");
        Cheques.clickButtonIssueCheques();
        Cheques.enterTextIntoAmountInputField("200");
        Cheques.clickIssueChequesButton();
        Common.verifyMessagePopupIsDisplayed("Cheques are going to be issued");
    });
    it('customer should be able to cash cheque - cheque is on us', function () {
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Thomas Pynchon");
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("200");
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier);
        Cheques.enterTextIntoAccountNumberInputField(customerAccount2 + ".9100.00001");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsNotDisplayedIfIssuingBankCouldBeDetermined();
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("992017");
        Cheques.verifyWarningIsDisplayedIfChequeIsNotOpen();
        Cheques.verifyIssuingBankHasText("Branch " + officeIdentifier);
        Cheques.verifyIssuerHasText("Cormac McCarthy");
        Cheques.enterTextIntoAmountInputField("250.54");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyTransactionAmount("250.54");
        Cheques.clickConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('customer should not be able to cash same cheque', function () {
        //try and cash the same cheque again: determining from MICR should not be successful
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("200");
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier);
        Cheques.enterTextIntoAccountNumberInputField(customerAccount2 + ".9100.00001");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsDisplayedIfIssuingBankCouldNotBeDetermined();
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("992017");
        Cheques.verifyWarningIsDisplayedIfChequeIsNotOpen();
        //Issuing Bank/Issuer have error
        Cheques.verifyIssuingBankHasError();
        Cheques.verifyIssuerHasError();
        //Manually enter information and try to cash check anyways
        Cheques.enterTextIntoIssuingBankInputField("Branch " + officeIdentifier);
        Cheques.enterTextIntoIssuerInputField("Cormac McCarthy");
        Cheques.enterTextIntoAmountInputField("33");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyErrorMessageDisplayedWithTitleAndText("Invalid transaction", "Cheque 200~" + officeIdentifier + "~" + customerAccount2 + ".9100.00001 already used.");
        Cheques.clickButtonOKInErrorMessage();
        //open issue: transaction is created anyways, should not be created
        //change cheque number to a number that has not yet been issued for the customer
        // Cheques.enterTextIntoChequeNumberInputField("201");
        // Cheques.clickButtonDetermineFromMICR();
        // Cheques.verifyWarningIsDisplayedIfIssuingBankCouldNotBeDetermined();
        // Cheques.verifyIssuingBankHasError();
        // Cheques.verifyIssuerHasError();
        //change back to cheque number that has been issued for the customer and that has not yet been used
        // Cheques.enterTextIntoChequeNumberInputField("199");
        // Cheques.clickButtonDetermineFromMICR();
        // Cheques.verifyWarningIsNotDisplayedIfIssuingBankCouldBeDetermined();
        // Cheques.verifyIssuingBankHasText("Branch " + officeIdentifier);
        // Cheques.verifyIssuerHasText("Cormac McCarthy");
    });
    it('journal entries for the transaction should be listed as expected', function () {
        //cheque not pending clearance
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount2 + ".9100.00001");
        Accounting.clickSearchButton();
        Accounting.verifyFirstJournalEntry("Order Cheque", "Amount: 250.54");
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("9000");
        Common.clickLinkShowForRowWithId("9100");
        Common.clickLinkShowForRowWithId(customerAccount2 + ".9100.00001");
        Accounting.viewAccountEntriesForAccount(customerAccount2 + ".9100.00001");
        Accounting.verifyTransactionTypeForRow("DEBIT", 1);
        Accounting.verifyTransactionMessageForRow("ORCQ", 1);
        Accounting.verifyTransactionAmountForRow("250.54", 1);
        Accounting.verifyTransactionBalanceForRow("-250.54", 1);
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId(customerAccount + ".9100.00001");
        Accounting.viewAccountEntriesForAccount(customerAccount + ".9100.00001");
        Accounting.verifyTransactionTypeForRow("CREDIT", 5);
        Accounting.verifyTransactionMessageForRow("ORCQ", 5);
        Accounting.verifyTransactionAmountForRow("250.54", 5);
        Accounting.verifyTransactionBalanceForRow("5750.54", 5);
    });
    it('input should be validated and CREATE TRANSACTION button is only enabled with valid input', function () {
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount2);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Cormac McCarthy");
        Teller.clickOnCashChequeForCustomer(customerAccount2);
        //Cheque number is not a number
        Cheques.enterTextIntoChequeNumberInputField("c1");
        //Office identifier exceeds 11 characters
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier2);
        Cheques.enterTextIntoAccountNumberInputField(customerAccount + ".9100.00001");
        Cheques.verifyButtonDetermineFromMICRDisabled();
        Cheques.verifyChequeNumberInputHasErrorIfInputNoNumber();
        Cheques.verifyBranchSortCodeInputHasErrorIfCharacterLimitExceeded();
        //Issuing bank has special chars
        Cheques.enterTextIntoIssuingBankInputField("Unión de Crédito Español");
        Cheques.enterTextIntoIssuerInputField("Paul Auster");
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Cormac McCarthy");
        //Date should not be more than 6 months in the past
        Cheques.enterTextIntoDateIssuedInputField("8111999");
        Cheques.enterTextIntoAmountInputField("26.78");
        Cheques.selectAccountToTransferTo(customerAccount2 + ".9100.00001");
        Cheques.verifyCreateTransactionButtonIsDisabled();
        Cheques.enterTextIntoChequeNumberInputField("01");
        Cheques.verifyCreateTransactionButtonIsDisabled();
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier);
        Cheques.verifyButtonDetermineFromMICREnabled();
        Cheques.verifyCreateTransactionButtonIsEnabled();
        //amount is 0 or negative
        Cheques.enterTextIntoAmountInputField("0");
        Cheques.verifyAmountInputHasErrorIfInput0OrNegative();
        Cheques.verifyCreateTransactionButtonIsDisabled();
        Cheques.enterTextIntoAmountInputField("0.02");
        Cheques.verifyCreateTransactionButtonIsEnabled();
        Cheques.enterTextIntoAmountInputField("-4");
        Cheques.verifyAmountInputHasErrorIfInput0OrNegative();
        Cheques.verifyCreateTransactionButtonIsDisabled();
        Cheques.enterTextIntoAmountInputField("100,000.99");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyErrorMessageDisplayedWithTitleAndText("Invalid transaction", "Cheque is older than 6 months.");
        //open issue: transaction is created anyways, should not be created
    });
    //amount too high (bad request)
    //special chars in branch sort field (bad request)
});