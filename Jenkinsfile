pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'npm ci'
          }
        }
      }
    }
    stage('Test') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run test:ci'
          } else {
            bat 'npm run test:ci'
          }
        }
        junit 'test-results/junit.xml'
        archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
      }
    }
    stage('Deploy') {
      steps {
        script {
          if (isUnix()) {
            sh '''
              set -e
              docker version
              docker build -t cicd-sample-app:${BUILD_NUMBER} .
              docker rm -f cicd-sample-app || true
              docker run -d --name cicd-sample-app -p 3000:3000 cicd-sample-app:${BUILD_NUMBER}
              for i in {1..30}; do
                if curl -fsS http://localhost:3000/api/health > /dev/null; then
                  echo "Health OK"
                  exit 0
                fi
                sleep 2
              done
              echo "Health check failed"
              exit 1
            '''
          } else {
            bat '''
              docker version
              docker build -t cicd-sample-app:%BUILD_NUMBER% .
              docker rm -f cicd-sample-app || ver > nul
              docker run -d --name cicd-sample-app -p 3000:3000 cicd-sample-app:%BUILD_NUMBER%
              powershell -NoProfile -Command "$i=0; while($i -lt 30){ try { $r = iwr -UseBasicParsing http://localhost:3000/api/health -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch {} start-sleep -Seconds 2; $i++ } exit 1"
            '''
          }
        }
      }
      post {
        always {
          script {
            if (isUnix()) {
              sh '''
                docker logs cicd-sample-app > docker-logs.txt 2>&1 || true
                docker stop cicd-sample-app || true
                docker rm cicd-sample-app || true
              '''
            } else {
              bat '''
                docker logs cicd-sample-app > docker-logs.txt 2>&1 || ver > nul
                docker stop cicd-sample-app || ver > nul
                docker rm cicd-sample-app || ver > nul
              '''
            }
          }
          archiveArtifacts artifacts: 'docker-logs.txt', allowEmptyArchive: true
        }
      }
    }
  }
}
