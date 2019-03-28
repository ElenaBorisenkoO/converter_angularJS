'use strict';

function runBlock($rootScope, $log, $transitions, authenticationService) {
	'ngInject';

	
	const limitedPermission = {
		to: state => !$rootScope.currentUser || state.data.role.every(item => item !== $rootScope.currentUser.role)
	}
	
	// $localStorage.token = 'currentUser';

	// const haveToken = $localStorage.token;

	// $transitions.onBefore(true, function (transition) {
	// 	if (!haveToken) {
	// 	return transition.abort();
	// 	}
	// });

	// $transitions.onBefore(haveToken, function() {
	// 	return authenticationService.signInToFirebase('monroe@gmail.com', 'monroe@gmail.com')
	// });


	$transitions.onBefore(limitedPermission, function(transition) {
		$log.log(transition)

		const toSignPage = transition.to().name === 'sign-in' || transition.to().name === 'sign-up';

		const toAdminPages = transition.to().name === 'admin' || transition.to().name === 'transactionsList';

		const toUserOrAdminPage = transition.to().name !== 'sign-in' && transition.to().name !== 'sign-up';

		// abort if not authorized user try to go to any page
		if (!$rootScope.currentUser && toUserOrAdminPage) {
			return transition.abort();
		}

		// abort if authorized user or admin try to go to sign-in/up page
		if ($rootScope.currentUser && toSignPage) {
			return transition.abort()
		}
		
		// sign out if authorized user try to go to admin page
		if ($rootScope.currentUser && toAdminPages) {
			return authenticationService.signOutFromFirebase();
		}

	})
}

export default runBlock;
